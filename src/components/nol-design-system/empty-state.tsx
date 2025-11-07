import React, { ReactElement } from 'react';
import { cn } from '../ui/utils';
import { Button } from '../ui/button';

export interface EmptyStateButtonProps {
  content: string;
  onClick?: () => void;
}

export interface EmptyStateProps {
  icon?: ReactElement;
  title: string;
  description?: string | React.ReactNode;
  buttons?: EmptyStateButtonProps[];
  pcType?: 'pcSize' | 'pcLegacySize';
}

export const EmptyState: React.FC<EmptyStateProps> = ({ icon: Icon, title, description, buttons, pcType = 'pcSize' }) => {
  return (
    <div className="flex max-w-[360px] flex-col items-center p-8">
      {Icon && (
        <div className="mb-3">
          {React.cloneElement(Icon, { className: cn('text-gray-400', Icon.props.className) })}
        </div>
      )}
      <div className="flex flex-col items-center">
        <div className="text-center text-base font-medium text-gray-900">{title}</div>
        {description && (
          <div className="mt-1 text-center text-sm text-gray-600">
            {typeof description === 'string' ? description : description}
          </div>
        )}
      </div>
      {buttons && buttons.length > 0 && (
        <div className="mt-4 flex flex-col">
          {buttons.map((button, index) => (
            <Button
              key={index}
              className={cn('w-full min-w-[180px]', {
                'mt-2': index !== 0,
              })}
              onClick={button.onClick}
              variant={index === 0 ? 'default' : 'outline'}
            >
              {button.content}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
};

EmptyState.displayName = 'EmptyState';

