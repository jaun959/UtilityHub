import React from 'react';

const ToolCard = ({ title, description, children }) => {
  return (
    <div className="relative rounded-xl border bg-card text-card-foreground shadow hover:shadow-lg transition-shadow duration-200 ease-in-out flex flex-col">
      <div className="flex flex-col space-y-1.5 p-6">
        <h3 className="text-2xl font-semibold leading-none tracking-tight">{title}</h3>
        {description && <p className="text-sm text-muted-foreground mt-2">{description}</p>}
      </div>
      <div className="p-6 pt-0 flex-grow">
        {children}
      </div>
    </div>
  );
};

export default ToolCard;