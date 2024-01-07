import './index.scss';
import { BlockType } from './constants';

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
