import { Modal } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';

interface DeleteConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  requestTypeName: string;
  loading?: boolean;
}

export function DeleteConfirmDialog({
  open,
  onOpenChange,
  onConfirm,
  requestTypeName,
  loading = false,
}: DeleteConfirmDialogProps) {
  return (
    <Modal
      title={
        <span>
          <ExclamationCircleOutlined style={{ color: '#ff4d4f', marginRight: 8 }} />
          Delete Request Type
        </span>
      }
      open={open}
      onCancel={() => onOpenChange(false)}
      onOk={onConfirm}
      confirmLoading={loading}
      okText={loading ? 'Deleting...' : 'Delete Request Type'}
      okButtonProps={{ danger: true }}
      cancelButtonProps={{ disabled: loading }}
    >
      <p>
        Are you sure you want to delete{' '}
        <strong>"{requestTypeName}"</strong>?
      </p>
      <p style={{ marginTop: 8 }}>
        This action cannot be undone.
      </p>
    </Modal>
  );
}
