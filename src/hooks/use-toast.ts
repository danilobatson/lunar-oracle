import { toast as hotToast } from 'react-hot-toast';

export function useToast() {
  return {
    toast: ({ title, description, variant }: {
      title: string;
      description?: string;
      variant?: 'default' | 'destructive'
    }) => {
      if (variant === 'destructive') {
        hotToast.error(`${title}${description ? ': ' + description : ''}`);
      } else {
        hotToast.success(`${title}${description ? ': ' + description : ''}`);
      }
    }
  };
}
