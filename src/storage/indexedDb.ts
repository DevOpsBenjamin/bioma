export interface LevelProgress {
  levelId: number
  completed: boolean
  hasOneShotStar: boolean
  attempts: number
  bestTimeSeconds?: number
  completedAt?: string
}

export interface UserSettings {
  autoRootsRowCol: boolean
  autoRootsNeighbors: boolean
  autoRootsBiome: boolean
  hapticsEnabled: boolean
  soundEnabled: boolean
  colorblindMode: boolean
}

export interface SaveBackup {
  version: 1
  exportedAt: string
  progress: LevelProgress[]
  settings: UserSettings
}

const DB_NAME = 'bioma-db'
const DB_VERSION = 1
const STORE_PROGRESS = 'progress'
const STORE_SETTINGS = 'settings'

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === 'undefined') {
      return reject(new Error('IndexedDB non disponible dans cet environnement'))
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION)

    request.onupgradeneeded = () => {
      const db = request.result
      if (!db.objectStoreNames.contains(STORE_PROGRESS)) {
        db.createObjectStore(STORE_PROGRESS, { keyPath: 'levelId' })
      }
      if (!db.objectStoreNames.contains(STORE_SETTINGS)) {
        db.createObjectStore(STORE_SETTINGS, { keyPath: 'key' })
      }
    }

    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

export async function getAllProgress(): Promise<Record<number, LevelProgress>> {
  try {
    const db = await openDatabase()
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_PROGRESS, 'readonly')
      const store = tx.objectStore(STORE_PROGRESS)
      const request = store.getAll()

      request.onsuccess = () => {
        const result: Record<number, LevelProgress> = {}
        for (const item of request.result as LevelProgress[]) {
          result[item.levelId] = item
        }
        resolve(result)
      }
      request.onerror = () => reject(request.error)
    })
  } catch {
    return {}
  }
}

export async function saveLevelProgress(progress: LevelProgress): Promise<void> {
  if (typeof indexedDB === 'undefined') return
  try {
    const db = await openDatabase()
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_PROGRESS, 'readwrite')
      const store = tx.objectStore(STORE_PROGRESS)
      const request = store.put(progress)

      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
    })
  } catch (err) {
    console.warn('Erreur sauvegarde IndexedDB :', err)
  }
}

export async function getStoredSettings(): Promise<UserSettings | null> {
  try {
    const db = await openDatabase()
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_SETTINGS, 'readonly')
      const store = tx.objectStore(STORE_SETTINGS)
      const request = store.get('user_settings')

      request.onsuccess = () => {
        if (request.result && request.result.data) {
          resolve(request.result.data as UserSettings)
        } else {
          resolve(null)
        }
      }
      request.onerror = () => reject(request.error)
    })
  } catch {
    return null
  }
}

export async function saveStoredSettings(settings: UserSettings): Promise<void> {
  if (typeof indexedDB === 'undefined') return
  try {
    const db = await openDatabase()
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_SETTINGS, 'readwrite')
      const store = tx.objectStore(STORE_SETTINGS)
      const request = store.put({ key: 'user_settings', data: settings })

      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
    })
  } catch (err) {
    console.warn('Erreur sauvegarde réglages IndexedDB :', err)
  }
}

export async function exportSaveBackup(settings: UserSettings): Promise<string> {
  const progressMap = await getAllProgress()
  const backup: SaveBackup = {
    version: 1,
    exportedAt: new Date().toISOString(),
    progress: Object.values(progressMap),
    settings
  }
  return JSON.stringify(backup, null, 2)
}

export async function importSaveBackup(jsonString: string): Promise<SaveBackup> {
  const backup = JSON.parse(jsonString) as SaveBackup
  if (!backup || backup.version !== 1 || !Array.isArray(backup.progress)) {
    throw new Error('Fichier de sauvegarde invalide ou corrompu')
  }

  const db = await openDatabase()
  const tx = db.transaction([STORE_PROGRESS, STORE_SETTINGS], 'readwrite')
  const progressStore = tx.objectStore(STORE_PROGRESS)
  const settingsStore = tx.objectStore(STORE_SETTINGS)

  // Effacer l'ancien contenu et restaurer
  await new Promise<void>((resolve, reject) => {
    const clearReq = progressStore.clear()
    clearReq.onsuccess = () => resolve()
    clearReq.onerror = () => reject(clearReq.error)
  })

  for (const item of backup.progress) {
    progressStore.put(item)
  }

  if (backup.settings) {
    settingsStore.put({ key: 'user_settings', data: backup.settings })
  }

  return backup
}
