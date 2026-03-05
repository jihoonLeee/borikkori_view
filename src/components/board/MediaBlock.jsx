import React, { useRef, useCallback } from 'react';
import { SelectionState } from 'draft-js';

/**
 * Draft.js atomic block 렌더러 컴포넌트.
 * BoardWriteContainer 밖에 선언하여 React.memo가 정상 동작합니다.
 */
const MediaBlock = React.memo((props) => {
  const { block, contentState, blockProps } = props;
  const { setSelection } = blockProps;
  const entityKey = block.getEntityAt(0);
  const videoRef = useRef(null);

  const handleVideoFocus = useCallback(() => {
    if (videoRef.current) {
      videoRef.current.blur();
    }
  }, []);

  const handleClick = useCallback(
    (e) => {
      e.stopPropagation();
      const selection = SelectionState.createEmpty(block.getKey()).merge({
        anchorOffset: 0,
        focusOffset: 1,
        hasFocus: true,
      });
      setSelection(selection);
    },
    [block, setSelection]
  );

  if (!entityKey) return null;

  const entity = contentState.getEntity(entityKey);
  const type = entity.getType();
  const { src } = entity.getData();

  return (
    <div
      data-draft-js-block="true"
      className="atomic-block"
      style={{ userSelect: 'none' }}
      onClick={handleClick}
    >
      {type === 'IMAGE' ? (
        <img src={src} alt="uploaded" style={{ maxWidth: '100%' }} />
      ) : type === 'VIDEO' ? (
        <video
          ref={videoRef}
          src={src}
          controls
          style={{ maxWidth: '100%' }}
          onFocus={handleVideoFocus}
          tabIndex="-1"
        />
      ) : null}
    </div>
  );
});

MediaBlock.displayName = 'MediaBlock';

export default MediaBlock;
