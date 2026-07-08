import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react'

const Modal = ({ isOpen, onClose, title, children, width = 'max-w-3xl' }) => {
  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/40" aria-hidden="true" />
      <div className="fixed inset-0 overflow-y-auto p-4">
        <div className="flex min-h-full items-center justify-center">
          <DialogPanel className={`w-full ${width} max-h-[90vh] overflow-y-auto rounded-xl bg-white p-5 shadow-xl dark:bg-gray-800`}>
          <DialogTitle className="text-lg font-semibold text-gray-900 dark:text-white">{title}</DialogTitle>
          <div className="mt-4">{children}</div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  )
}

export default Modal
