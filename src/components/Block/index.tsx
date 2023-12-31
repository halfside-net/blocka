import './index.scss';
import { BlockType } from './types';

export default function Block(props: {
  preview?: boolean;
  type: BlockType;
}) {
  return (
    <div
      className={'Block'
        + (props.type === BlockType.NORMAL ? ' Block--normal' : '')
        + (props.preview ? ' Block--preview' : '')
      }
    >
    </div>
  );
}
