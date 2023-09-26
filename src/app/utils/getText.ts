export default (messages): string => {
  let text = '';
  const typeMessge = messages.type;
  if (typeMessge === 'text') {
    text = messages.text.body;
  } else if (typeMessge === 'interactive') {
    const interactiveObject = messages.interactive;
    const typeInteractive = interactiveObject.type;

    if (typeInteractive === 'button_reply') {
      text = interactiveObject.button_reply.title;
    } else if (typeInteractive === 'list_reply') {
      text = interactiveObject.list_reply.title;
    }
  }
  return text;
};
