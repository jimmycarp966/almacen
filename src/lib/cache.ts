// Utilidades de caching para optimizar el rendimiento

interface CacheEntry<T> {
  data: T
  timestamp: number
  ttl: number // Time to live in milliseconds
}

class CacheManager {
  public cache: Map<string, CacheEntry<any>> = new Map()
  private defaultTTL: number = 5 * 60 * 1000 // 5 minutos por defecto

  /**
   * Obtiene un valor del cache
   */
  get<T>(key: string): T | null {
    const entry = this.cache.get(key)
    
    if (!entry) {
      return null
    }

    // Verificar si el cache ha expirado
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key)
      return null
    }

    return entry.data as T
  }

  /**
   * Establece un valor en el cache
   */
  set<T>(key: string, data: T, ttl?: number): void {
    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
      ttl: ttl || this.defaultTTL,
    }
    this.cache.set(key, entry)
  }

  /**
   * Elimina un valor del cache
   */
  delete(key: string): void {
    this.cache.delete(key)
  }

  /**
   * Limpia todo el cache
   */
  clear(): void {
    this.cache.clear()
  }

  /**
   * Elimina entradas expiradas
   */
  cleanExpired(): void {
    const now = Date.now()
    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > entry.ttl) {
        this.cache.delete(key)
      }
    }
  }

  /**
   * Obtiene o establece un valor (cache miss)
   */
  async getOrSet<T>(
    key: string,
    fetcher: () => Promise<T>,
    ttl?: number
  ): Promise<T> {
    const cached = this.get<T>(key)
    if (cached !== null) {
      return cached
    }

    const data = await fetcher()
    this.set(key, data, ttl)
    return data
  }

  /**
   * Obtiene el tamaño del cache
   */
  getCacheSize(): number {
    return this.cache.size
  }

  /**
   * Obtiene estadísticas del cache
   */
  getStats() {
    const now = Date.now()
    let expired = 0
    let valid = 0

    for (const entry of this.cache.values()) {
      if (now - entry.timestamp > entry.ttl) {
        expired++
      } else {
        valid++
      }
    }

    return {
      size: this.cache.size,
      valid,
      expired,
    }
  }
}

// Instancia singleton del cache manager
const cacheManager = new CacheManager()

/**
 * Obtiene datos del cache o los busca si no existen
 */
export async function getCachedData<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttl?: number
): Promise<T> {
  return cacheManager.getOrSet(key, fetcher, ttl)
}

/**
 * Invalida una entrada específica del cache
 */
export function invalidateCache(key: string): void {
  cacheManager.delete(key)
}

/**
 * Invalida múltiples entradas del cache por patrón
 */
export function invalidateCachePattern(pattern: string): void {
  const regex = new RegExp(pattern)
  for (const key of cacheManager.cache.keys()) {
    if (regex.test(key)) {
      cacheManager.delete(key)
    }
  }
}

/**
 * Limpia todo el cache
 */
export function clearAllCache(): void {
  cacheManager.clear()
}

/**
 * Limpia entradas expiradas del cache
 */
export function cleanExpiredCache(): void {
  cacheManager.cleanExpired()
}

/**
 * Prefetch de datos para cargar en caché
 */
export async function prefetchData<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttl?: number
): Promise<void> {
  try {
    await cacheManager.getOrSet(key, fetcher, ttl)
  } catch (error) {
    console.error(`Error prefetching data for key ${key}:`, error)
  }
}

/**
 * Obtiene el tamaño del cache
 */
export function getCacheSize(): number {
  return cacheManager.getCacheSize()
}

/**
 * Obtiene estadísticas del cache
 */
export function getCacheStats() {
  return cacheManager.getStats()
}

/**
 * Cache para categorías (TTL: 10 minutos)
 */
export const CATEGORIES_CACHE_KEY = 'categories'
export const CATEGORIES_CACHE_TTL = 10 * 60 * 1000

/**
 * Cache para productos (TTL: 5 minutos)
 */
export const PRODUCTS_CACHE_KEY = 'products'
export const PRODUCTS_CACHE_TTL = 5 * 60 * 1000

/**
 * Cache para productos por categoría (TTL: 5 minutos)
 */
export const PRODUCTS_BY_CATEGORY_CACHE_KEY = (categoriaId: string) => `products:${categoriaId}`
export const PRODUCTS_BY_CATEGORY_CACHE_TTL = 5 * 60 * 1000

/**
 * Cache para dashboard stats (TTL: 1 minuto)
 */
export const DASHBOARD_STATS_CACHE_KEY = 'dashboard_stats'
export const DASHBOARD_STATS_CACHE_TTL = 1 * 60 * 1000

/**
 * Cache para reportes (TTL: 10 minutos)
 */
export const REPORTS_CACHE_KEY = 'reports'
export const REPORTS_CACHE_TTL = 10 * 60 * 1000
