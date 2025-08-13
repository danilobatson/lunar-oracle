import { toast as hotToast } from 'react-hot-toast';

interface ToastProps {
	title: string;
	description?: string;
	variant?: 'default' | 'destructive';
}

export function useToast() {
	return {
		toast: ({ title, description, variant = 'default' }: ToastProps) => {
			const message = description ? `${title}: ${description}` : title;

			if (variant === 'destructive') {
				hotToast.error(message, {
					duration: 4000,
					style: {
						background: '#7f1d1d',
						color: '#fff',
						border: '1px solid #dc2626',
					},
				});
			} else {
				hotToast.success(message, {
					duration: 4000,
					style: {
						background: '#1e293b',
						color: '#fff',
						border: '1px solid #22c55e',
					},
				});
			}
		},
	};
}
