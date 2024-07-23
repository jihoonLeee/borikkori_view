import { Dialog } from '@headlessui/react';

const DialogPanel = ({ children, ...props }) => (
  <Dialog.Panel 
    className="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10" 
    {...props}
  >
    {children}
  </Dialog.Panel>
);

export default DialogPanel;
