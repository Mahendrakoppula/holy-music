type Message = {
    success: string;
    error: string;
    warning: string;
  };
  type Color = keyof Message;
  // generate color console
  const colors = {
    reset: '\x1b[0m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
  };
  
  // make a color full console function it have warn error and log
  // for more info https://stackoverflow.com/questions/9781218/how-to-change-node-jss-console-font-color
  // Generate color console
  const color = {
    success: colors.green,
    error: colors.red,
    warning: colors.yellow,
  };
  
  // Generate color function with icon
  export const logger = (type: Color, icon: string='→') => {
    return (message: string) => {
      console.log(color[type],icon,message, colors.reset);
    };
  };