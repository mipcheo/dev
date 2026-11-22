import { RuleTester } from 'eslint';
import { describe, it } from 'vitest';

// ESLint's RuleTester reports through a global `describe` and `it`, which Vitest does not set here: every rule's test gets them from this one place.
RuleTester.describe = describe;
RuleTester.it = it;
RuleTester.itOnly = it.only;
