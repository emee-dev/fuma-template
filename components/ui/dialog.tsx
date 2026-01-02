import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { StretchHorizontal, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "./button";

const Dialog = DialogPrimitive.Root;

const DialogTrigger = DialogPrimitive.Trigger;

const DialogPortal = DialogPrimitive.Portal;

const DialogClose = DialogPrimitive.Close;

type DialogOverlayProps = React.ComponentPropsWithoutRef<
  typeof DialogPrimitive.Overlay
> & {
  showOverlay?: boolean;
};

const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  DialogOverlayProps
>(({ className, showOverlay = true, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 z-50  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      {
        // TODO handle dark themes
        // "bg-white/90 dark:bg-black/40": showOverlay,
        "bg-muted-foreground/20 transition-opacity backdrop-blur-[2px]":
          showOverlay,
      },
      className
    )}
    {...props}
  />
));

DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;

// interface ExtendedDialogContentProps
//   extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> {
//   showOverlay?: boolean;
//   hiddenCloseButton?: boolean;
//   moreButtons?: React.ReactNode;
// }

// const DialogContent = React.forwardRef<
//   React.ElementRef<typeof DialogPrimitive.Content>,
//   ExtendedDialogContentProps
// >(
//   (
//     {
//       className,
//       children,
//       moreButtons,
//       hiddenCloseButton = false,
//       showOverlay,
//       ...props
//     },
//     ref
//   ) => (
//     // <DialogPortal>
//     //   <DialogOverlay showOverlay={showOverlay} />
//     //   <DialogPrimitive.Content
//     //     ref={ref}
//     //     className={cn(
//     //       "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg",
//     //       className
//     //     )}
//     //     {...props}
//     //   >
//     //     {children}

//     //     <div className="flex items-center gap-x-2 absolute right-1 top-1 bg-background rounded-md">
//     //       {/* <Button
//     //         variant="ghost"
//     //         size="icon"
//     //         className="size-7 hover:bg-muted-foreground/50"
//     //       >
//     //         <StretchHorizontal className="h-4" />
//     //         <span className="sr-only">Json schema</span>
//     //       </Button> */}
//     //       {moreButtons}
//     //       {!hiddenCloseButton && (
//     //         <DialogPrimitive.Close
//     //           className=" rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
//     //           asChild
//     //         >
//     //           <Button
//     //             variant="ghost"
//     //             size="icon"
//     //             className="size-7 hover:bg-muted-foreground/50"
//     //           >
//     //             <X className="h-4" />
//     //             <span className="sr-only">Close</span>
//     //           </Button>
//     //         </DialogPrimitive.Close>
//     //       )}
//     //     </div>
//     //   </DialogPrimitive.Content>
//     // </DialogPortal>
//     <>
//       <DialogOverlay showOverlay={showOverlay} />
//       <DialogPrimitive.Content
//         ref={ref}
//         className={cn(
//           "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg",
//           className
//         )}
//         {...props}
//       >
//         {children}

//         <div className="flex items-center gap-x-2 absolute right-1 top-1 bg-background rounded-md">
//           {/* <Button
//             variant="ghost"
//             size="icon"
//             className="size-7 hover:bg-muted-foreground/50"
//           >
//             <StretchHorizontal className="h-4" />
//             <span className="sr-only">Json schema</span>
//           </Button> */}
//           {moreButtons}
//           {!hiddenCloseButton && (
//             <DialogPrimitive.Close
//               className=" rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
//               asChild
//             >
//               <Button
//                 variant="ghost"
//                 size="icon"
//                 className="size-7 hover:bg-muted-foreground/50"
//               >
//                 <X className="h-4" />
//                 <span className="sr-only">Close</span>
//               </Button>
//             </DialogPrimitive.Close>
//           )}
//         </div>
//       </DialogPrimitive.Content>
//     </>
//   )
// );

interface ExtendedDialogContentProps
  extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> {
  showOverlay?: boolean;
  hiddenCloseButton?: boolean;
  moreButtons?: React.ReactNode;
  /** ✅ When true, renders without Radix Portal (inline). Useful for editors, charts, etc. */
  noPortal?: boolean;
}

const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  ExtendedDialogContentProps
>(
  (
    {
      className,
      children,
      moreButtons,
      hiddenCloseButton = false,
      showOverlay,
      noPortal = false,
      ...props
    },
    ref
  ) => {
    const content = (
      <>
        <DialogOverlay showOverlay={showOverlay} />
        <DialogPrimitive.Content
          ref={ref}
          className={cn(
            "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg",
            className
          )}
          {...props}
        >
          {children}

          <div className="flex items-center gap-x-2 absolute right-1 top-1 bg-background rounded-md">
            {moreButtons}
            {!hiddenCloseButton && (
              <DialogPrimitive.Close
                className="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
                asChild
              >
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-7 hover:bg-muted-foreground/50"
                >
                  <X className="h-4" />
                  <span className="sr-only">Close</span>
                </Button>
              </DialogPrimitive.Close>
            )}
          </div>
        </DialogPrimitive.Content>
      </>
    );

    if (noPortal) {
      return content;
    }

    return <DialogPrimitive.Portal>{content}</DialogPrimitive.Portal>;
  }
);

DialogContent.displayName = DialogPrimitive.Content.displayName;

const DialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col space-y-1.5 text-center sm:text-left",
      className
    )}
    {...props}
  />
);
DialogHeader.displayName = "DialogHeader";

const DialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
      className
    )}
    {...props}
  />
);
DialogFooter.displayName = "DialogFooter";

const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn(
      "text-lg font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
));
DialogTitle.displayName = DialogPrimitive.Title.displayName;

const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
));
DialogDescription.displayName = DialogPrimitive.Description.displayName;

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogTrigger,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
};
