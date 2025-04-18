import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';

export interface Notification {
  id: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
}

interface NotificationStore {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id'>) => void;
  removeNotification: (id: string) => void;
}

interface ApiError {
  response?: {
    status: number;
    data?: {
      message?: string;
    };
  };
  request?: unknown;
  message?: string;
}

export const useNotificationStore = create<NotificationStore>((set) => ({
  notifications: [],
  addNotification: (notification: Omit<Notification, 'id'>) => {
    const id = uuidv4();
    set((state) => ({
      notifications: [...state.notifications, { ...notification, id }],
    }));

    if (notification.duration !== 0) {
      setTimeout(() => {
        set((state) => ({
          notifications: state.notifications.filter((n) => n.id !== id),
        }));
      }, notification.duration || 3000);
    }
  },
  removeNotification: (id: string) => {
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    }));
  },
}));

// Helper functions for common notification types
export const showSuccess = (message: string, duration?: number) => {
  useNotificationStore.getState().addNotification({
    message,
    type: 'success',
    duration,
  });
};

export const showError = (message: string, duration?: number) => {
  useNotificationStore.getState().addNotification({
    message,
    type: 'error',
    duration,
  });
};

export const showWarning = (message: string, duration?: number) => {
  useNotificationStore.getState().addNotification({
    message,
    type: 'warning',
    duration,
  });
};

export const showInfo = (message: string, duration?: number) => {
  useNotificationStore.getState().addNotification({
    message,
    type: 'info',
    duration,
  });
};

// HTTP error handler
export const handleHttpError = (error: ApiError, defaultMessage = 'Đã xảy ra lỗi') => {
  console.error('HTTP Error:', error);
  
  let errorMessage = defaultMessage;
  
  if (error.response) {
    // Server responded with a status code outside the 2xx range
    const status = error.response.status;
    const data = error.response.data;
    
    if (data?.message) {
      errorMessage = data.message;
    } else if (status === 401) {
      errorMessage = 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.';
    } else if (status === 403) {
      errorMessage = 'Bạn không có quyền thực hiện hành động này.';
    } else if (status === 404) {
      errorMessage = 'Không tìm thấy tài nguyên yêu cầu.';
    } else if (status === 500) {
      errorMessage = 'Đã xảy ra lỗi máy chủ. Vui lòng thử lại sau.';
    } else if (status === 503) {
      errorMessage = 'Dịch vụ tạm thời không khả dụng. Vui lòng thử lại sau.';
    }
  } else if (error.request) {
    // Request was made but no response was received
    errorMessage = 'Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng.';
  } else {
    // Something happened in setting up the request
    errorMessage = 'Đã xảy ra lỗi khi thiết lập yêu cầu.';
  }
  
  showError(errorMessage);
  return errorMessage;
}; 