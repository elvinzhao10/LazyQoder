import { completionApplies } from './adapters/completion.mjs';
import { compatiblePlanRevision } from './commands.mjs';
import { createProjector } from '../dashboard/projection.mjs';

export const projectSnapshot = createProjector({ completionApplies, compatiblePlanRevision });
