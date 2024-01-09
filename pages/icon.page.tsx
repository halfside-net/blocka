import '~/sass/pages/icon.scss';
import { toPng, toSvg } from 'html-to-image';
import { useRef, useState } from 'react';
import Board from '~/components/Board';
import { BlockType } from '~/components/Block/constants';

const titleBlocks = [
  [ ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ],
  [ , 8, 8, 8,  , 8,  ,  ,  , 8, 8, 8,  ],
  [ , 8,  , 8,  , 8,  ,  ,  , 8,  , 8,  ],
  [ , 8, 8,  ,  , 8,  ,  ,  , 8,  , 8,  ],
  [ , 8,  , 8,  , 8,  ,  ,  , 8,  , 8,  ],
  [ , 8, 8, 8,  , 8, 8, 8,  , 8, 8, 8,  ],
  [ ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ],
  [ , 8, 8, 8,  , 8,  , 8,  ,  , 8,  ,  ],
  [ , 8,  ,  ,  , 8,  , 8,  , 8,  , 8,  ],
  [ , 8,  ,  ,  , 8, 8,  ,  , 8, 8, 8,  ],
  [ , 8,  ,  ,  , 8,  , 8,  , 8,  , 8,  ],
  [ , 8, 8, 8,  , 8,  , 8,  , 8,  , 8,  ],
  [ ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ],
]
  .map(row => {
    const filledRow = new Array(row.length).fill(BlockType.EMPTY);

    row.forEach((_, i) => filledRow[i] = BlockType.NORMAL);

    return filledRow;
  });

function download(dataUrl: string, filename: string = '') {
  const downloadLink = document.createElement('a');

  downloadLink.download = filename;
  downloadLink.href = dataUrl;
  downloadLink.click();
}

export function PageHead() {
  return (
    <head>
      <meta httpEquiv="Content-Type" content="text/html;charset=utf-8" />
      <meta name="viewport" content="width=device-width,initial-scale=8" />

      <meta name="robots" content="noindex" />
    </head>
  );
}

export function Page() {
  const [isTransparent, setIsTransparent] = useState(false);

  const iconRef = useRef<HTMLDivElement>(null);

  return (
    <>
      <div
        className="Icon"
        ref={iconRef}
        style={{
          ['--board-size' as string]: titleBlocks.length,
          background: isTransparent ? 'none' : undefined,
        }}
      >
        <Board
          size={titleBlocks.length}
          state={titleBlocks}
        />
      </div>
      <div className="Download">
        <label className="Download-label">
          <input
            checked={isTransparent}
            className="Download-checkbox"
            onChange={() => setIsTransparent(!isTransparent)}
            type="checkbox"
          />
          {' '}Transparent
        </label>
        <button
          className="Download-button"
          onClick={async () => {
            if (iconRef.current) {
              download(await toPng(iconRef.current), `icon${isTransparent ? '_transparent' : ''}.png`);
            }
          }}
        >
          Download as PNG
        </button>
        <button
          className="Download-button"
          onClick={async () => {
            if (iconRef.current) {
              download(await toSvg(iconRef.current), `icon${isTransparent ? '_transparent' : ''}.svg`);
            }
          }}
        >
          Download as SVG
        </button>
      </div>
    </>
  );
}
