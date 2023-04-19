const COMMAND_DELAY = 100;

for (const command of ['click', 'type', 'clear']) {
    Cypress.Commands.overwrite(command as any, (originalFn, ...args) => {
        const origVal = originalFn(...args);

        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(origVal);
            }, COMMAND_DELAY);
        });
    });
} 
