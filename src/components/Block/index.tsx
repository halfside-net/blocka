import './index.scss';
import { BlockType } from './types';

export default function Block(props: {
  isPreview?: boolean;
  type: BlockType;
}) {
  return (
    <div
      className={'Block'
        + (props.type === BlockType.NORMAL ? ' Block--normal' : '')
        + (props.isPreview ? ' Block--preview' : '')
      }
    >
    </div>
  );
}
