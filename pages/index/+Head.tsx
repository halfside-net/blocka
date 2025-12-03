import {
  description,
  sitePath,
  themeColor,
  title,
  titleShort,
} from "../../siteconfig.json";
import icons from "../../src/assets/images/icon.png?as=metadata&w=72;96;120;128;144;152;180;192;384;512";
import logoUrl from "../../src/assets/images/icon_transparent.png";

export default function Head() {
  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="shortcut icon" href={logoUrl} />
      <link rel="apple-touch-icon" href={logoUrl} />
      <link
        rel="manifest"
        href={`data:,${encodeURIComponent(
          JSON.stringify({
            background_color: themeColor,
            description,
            display: "standalone",
            icons: icons.map(
              (icon: {
                format: string;
                height: number;
                src: string;
                width: number;
              }) => ({
                sizes: `${icon.width}x${icon.height}`,
                src: icon.src,
                type: `image/${icon.format}`,
              })
            ),
            launch_handler: {
              client_mode: "focus-existing",
            },
            name: title,
            scope: sitePath,
            short_name: titleShort,
            start_url: sitePath,
            theme_color: themeColor,
          })
        )}`}
      />
    </>
  );
}
