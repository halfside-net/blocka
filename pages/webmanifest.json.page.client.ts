import { description, sitePath, themeColor, title, titleShort } from '../siteconfig.json';
import icons from '~/assets/images/icon.png?w=72;96;120;128;144;152;180;192;384;512';

const iconSizes = [72, 96, 120, 128, 144, 152, 180, 192, 384, 512];

export function render() {
  return JSON.stringify({
    background_color: themeColor,
    description,
    display: 'standalone',
    icons: iconSizes.map((size, i) => ({
      sizes: `${size}x${size}`,
      src: icons[i],
      type: 'image/png'
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
