import c from "classnames";
import { BlockType } from "../../schema/BlockType";
import s from "./Block.module.scss";

export default function Block(props: { isPreview?: boolean; type: BlockType }) {
  return (
    <div
      className={c(s.Block, {
        [s.Block__normal]: props.type === BlockType.NORMAL,
        [s.Block__preview]: props.isPreview,
      })}
    ></div>
  );
}
