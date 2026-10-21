const REQUIRED_STATES = ['loading', 'empty', 'error', 'retry', 'success'];

export function validateInteraction(interaction) {
  const errors = [];
  if (!interaction || typeof interaction !== 'object') return ['interaction must be an object'];
  if (!interaction.name) errors.push('name is required');
  const states = interaction.states || {};
  for (const state of REQUIRED_STATES) {
    if (!states[state]) errors.push(`missing state ${state}`);
  }
  if (interaction.aiAssisted === true && !interaction.disclosure) errors.push('AI-assisted flows need disclosure');
  if (interaction.persistsContext === true && !interaction.contextReset) errors.push('persistent context needs a reset path');
  return errors;
}

export function scoreInteraction(interaction) {
  const errors = validateInteraction(interaction);
  const states = interaction.states || {};
  const stateCount = REQUIRED_STATES.filter((state) => Boolean(states[state])).length;
  return {
    ready: errors.length === 0,
    errors,
    metrics: { stateCount, requiredStates: REQUIRED_STATES.length, disclosure: Boolean(interaction.disclosure), contextReset: Boolean(interaction.contextReset) }
  };
}
