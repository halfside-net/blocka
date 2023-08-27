import './index.scss';
import { BlockType } from './types';

export default function Block(props: {
  type: BlockType;
}) {
  return (
    <div
      className={'Block'
        + (props.type === BlockType.NORMAL ? ' Block--normal' : '')
      }
    >
      {props.type}
    </div>
  );
}
