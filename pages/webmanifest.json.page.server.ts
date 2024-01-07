import { dangerouslySkipEscape } from 'vite-plugin-ssr/server';
import type { InjectFilterEntry } from 'vite-plugin-ssr/types';
import { render as renderClient } from './webmanifest.json.page.client';

export function render() {
  return {
    documentHtml: dangerouslySkipEscape(renderClient()),
    injectFilter: (assets: InjectFilterEntry[]) => assets.forEach(asset => asset.inject = false)
  };
}
