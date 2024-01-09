import { description, sitePath, themeColor, title, titleShort } from '../siteconfig.json';
import icons from '~/assets/images/icon.png?as=metadata&w=72;96;120;128;144;152;180;192;384;512';

export function render() {
  return JSON.stringify({
    background_color: themeColor,
    description,
    display: 'standalone',
    icons: icons.map((icon: {
      format: string,
      height: number,
      src: string,
      width: number
    }) => ({
      sizes: `${icon.width}x${icon.height}`,
      src: icon.src,
      type: `image/${icon.format}`
    })),
    launch_handler: {
      client_mode: 'focus-existing'
    },
    name: title,
    scope: sitePath,
    short_name: titleShort,
    start_url: sitePath,
    theme_color: themeColor,
  });
}
