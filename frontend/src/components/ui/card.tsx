import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { Slot } from 'radix-ui';
import { cn } from '@/lib/utils';

const cardVariants = cva(
  "rounded-xl border bg-card text-card-foreground shadow-sm",
  {
    variants: {
      variant: {
        default: 'border-border',
        outline: 'border-border bg-transparent shadow-none',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

function Card({
  className,
  variant = 'default',
  asChild = false,
  ...props
}: React.ComponentProps<'div'> &
  VariantProps<typeof cardVariants> & {
  asChild?: boolean;
}) {
  const Comp = asChild ? Slot.Root : 'div';

  return (
    <Comp
      data-slot="card"
      data-variant={variant}
      className={cn(cardVariants({ variant, className }))}
      {...props}
    />
  );
}

const cardHeaderVariants = cva(
  "flex flex-col space-y-1.5 p-6",
  {
    variants: {
      align: {
        default: 'items-start text-left',
        center: 'items-center text-center',
        end: 'items-end text-right',
      },
    },
    defaultVariants: {
      align: 'default',
    },
  },
);

function CardHeader({
  className,
  align = 'default',
  asChild = false,
  ...props
}: React.ComponentProps<'div'> &
  VariantProps<typeof cardHeaderVariants> & {
  asChild?: boolean;
}) {
  const Comp = asChild ? Slot.Root : 'div';

  return (
    <Comp
      data-slot="card-header"
      data-align={align}
      className={cn(cardHeaderVariants({ align, className }))}
      {...props}
    />
  );
}

const cardTitleVariants = cva(
  "text-lg font-semibold leading-none tracking-tight",
  {
    variants: {},
    defaultVariants: {},
  },
);

function CardTitle({
  className,
  asChild = false,
  ...props
}: React.ComponentProps<'h3'> &
  VariantProps<typeof cardTitleVariants> & {
  asChild?: boolean;
}) {
  const Comp = asChild ? Slot.Root : 'h3';

  return (
    <Comp
      data-slot="card-title"
      className={cn(cardTitleVariants({ className }))}
      {...props}
    />
  );
}

const cardDescriptionVariants = cva(
  "text-sm text-muted-foreground",
  {
    variants: {},
    defaultVariants: {},
  },
);

function CardDescription({
  className,
  asChild = false,
  ...props
}: React.ComponentProps<'p'> &
  VariantProps<typeof cardDescriptionVariants> & {
  asChild?: boolean;
}) {
  const Comp = asChild ? Slot.Root : 'p';

  return (
    <Comp
      data-slot="card-description"
      className={cn(cardDescriptionVariants({ className }))}
      {...props}
    />
  );
}

const cardContentVariants = cva(
  "p-6 pt-0",
  {
    variants: {},
    defaultVariants: {},
  },
);

function CardContent({
  className,
  asChild = false,
  ...props
}: React.ComponentProps<'div'> &
  VariantProps<typeof cardContentVariants> & {
  asChild?: boolean;
}) {
  const Comp = asChild ? Slot.Root : 'div';

  return (
    <Comp
      data-slot="card-content"
      className={cn(cardContentVariants({ className }))}
      {...props}
    />
  );
}

const cardFooterVariants = cva(
  "flex items-center p-6 pt-0",
  {
    variants: {
      align: {
        default: 'items-start',
        center: 'items-center',
        end: 'items-end',
      },
    },
    defaultVariants: {
      align: 'default',
    },
  },
);

function CardFooter({
  className,
  align = 'default',
  asChild = false,
  ...props
}: React.ComponentProps<'div'> &
  VariantProps<typeof cardFooterVariants> & {
  asChild?: boolean;
}) {
  const Comp = asChild ? Slot.Root : 'div';

  return (
    <Comp
      data-slot="card-footer"
      data-align={align}
      className={cn(cardFooterVariants({ align, className }))}
      {...props}
    />
  );
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
};