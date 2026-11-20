import { describe, expect, it } from 'vitest';
import { MAX_PROMPT_LENGTH } from '../../src/models/Recommendation';
import { validatePrompt } from './prompt';

describe('validatePrompt', () => {
	it('trims and accepts normal prompts', () => {
		expect(validatePrompt('  a heist movie ')).toBe('a heist movie');
	});

	it('rejects non strings, empty and too long prompts', () => {
		expect(validatePrompt(42)).toBeNull();
		expect(validatePrompt('   ')).toBeNull();
		expect(validatePrompt('a'.repeat(MAX_PROMPT_LENGTH + 1))).toBeNull();
		expect(validatePrompt('a'.repeat(MAX_PROMPT_LENGTH))).not.toBeNull();
	});
});
