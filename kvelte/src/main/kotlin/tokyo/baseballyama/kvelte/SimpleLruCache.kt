package tokyo.baseballyama.kvelte

internal class SimpleLruCache<K, V> : LinkedHashMap<K, V>(16, 0.75f, true) {
    private var limit = 50
    override fun removeEldestEntry(eldest: Map.Entry<K, V>?): Boolean {
        return super.size > limit
    }
}