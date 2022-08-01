const scriptCache = new Set()

export default (url) => {
  /**
   * DOM API required.
   * Make sure in browser environment.
   * The Custom Icon will create a <script/>
   * that loads SVG symbols and insert the SVG Element into the document body.
   */
  return new Promise((resolve) => {
    if (
      typeof document !== 'undefined' &&
      typeof window !== 'undefined' &&
      typeof document.createElement === 'function' &&
      typeof url === 'string' &&
      url.length &&
      !scriptCache.has(url)
    ) {
      const script = document.createElement('script')
      script.setAttribute('src', url)
      script.setAttribute('data-namespace', url)
      scriptCache.add(url)
      document.body.appendChild(script)
      script.onload = resolve
    } else {
      resolve()
    }

  })


}
