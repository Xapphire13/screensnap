import { useEffect, useState } from 'react';

export default function useOnDrag(callback: (ev: MouseEvent) => void) {
  const [element, setElement] = useState<HTMLElement | null>();

  useEffect(() => {
    if (element) {
      const listener = (ev: MouseEvent) => {
        const mouseUpListener = () => {
          document.body.removeEventListener('mousemove', callback);
          document.body.removeEventListener('mouseup', mouseUpListener);
        };

        document.body.addEventListener('mousemove', callback);
        document.body.addEventListener('mouseup', mouseUpListener);

        ev.stopPropagation();
      };
      element.addEventListener('mousedown', listener);

      return () => {
        element?.removeEventListener('mousedown', listener);
      };
    }

    return () => {};
  }, [callback, element]);

  return [setElement] as [typeof setElement];
}
