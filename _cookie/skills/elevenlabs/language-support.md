# ElevenLabs Language Support

## Purpose

This document catalogs the languages supported by ElevenLabs text-to-speech, along with quality ratings, accent handling guidance, and practical notes for multilingual production workflows.

---

## Model Requirements

Language support depends on the model used:

| Model | Languages | Notes |
|-------|-----------|-------|
| `eleven_monolingual_v1` | English only | Legacy model. Highest English quality but no multilingual support. |
| `eleven_multilingual_v1` | 10+ languages | First-generation multilingual. Adequate quality. |
| `eleven_multilingual_v2` | 29+ languages | **Recommended.** Best quality across all supported languages. |
| `eleven_turbo_v2` | 29+ languages | Faster generation with slightly lower quality. Good for drafts. |
| `eleven_turbo_v2_5` | 32+ languages | Latest turbo model. Improved quality over v2 turbo. |

**For Cookie pipeline:** Always use `eleven_multilingual_v2` unless generation speed is critical (use turbo for drafts).

---

## Supported Languages

### Tier 1 — Excellent Quality

These languages have been extensively trained and produce near-native quality output. Minimal artifacts, natural prosody, correct intonation patterns.

| Language | Code | Quality Rating | Notes |
|----------|------|---------------|-------|
| **English** | `en` | Excellent | Best-supported language. All voices optimized for English. American, British, Australian, and other accents well-represented. |
| **Spanish** | `es` | Excellent | Both Castilian and Latin American variants supported. Voice selection affects accent. |
| **French** | `fr` | Excellent | Metropolitan French is primary. Canadian French may have slight accent mixing. |
| **German** | `de` | Excellent | Standard Hochdeutsch. Austrian and Swiss variants may require voice-specific tuning. |
| **Italian** | `it` | Excellent | Standard Italian. Strong prosody and natural rhythm. |
| **Portuguese** | `pt` | Excellent | Both Brazilian and European Portuguese. Specify in prompt context for better results. |
| **Polish** | `pl` | Excellent | Natural stress patterns and consonant clusters handled well. |

### Tier 2 — Very Good Quality

Natural-sounding output with occasional minor imperfections. Suitable for production use with quality review.

| Language | Code | Quality Rating | Notes |
|----------|------|---------------|-------|
| **Dutch** | `nl` | Very Good | Standard Dutch. Belgian Dutch (Flemish) may show slight differences. |
| **Hindi** | `hi` | Very Good | Devanagari script input supported. Romanized Hindi also works but less reliably. |
| **Turkish** | `tr` | Very Good | Vowel harmony generally handled correctly. Long words may occasionally stumble. |
| **Swedish** | `sv` | Very Good | Tonal accent (pitch accent) approximated but not always perfect. |
| **Czech** | `cs` | Very Good | Consonant clusters and háček letters handled well. |
| **Romanian** | `ro` | Very Good | Diacritical marks (ă, â, î, ș, ț) correctly interpreted. |
| **Ukrainian** | `uk` | Very Good | Cyrillic script input. Good quality, improving with updates. |
| **Indonesian** | `id` | Very Good | Clean pronunciation. Straightforward phonology maps well to TTS. |
| **Malay** | `ms` | Very Good | Similar to Indonesian with good results. |
| **Filipino** | `fil` | Very Good | Tagalog-based. Code-switching with English (Taglish) may produce mixed results. |

### Tier 3 — Good Quality

Usable for production with more careful quality review. Some prosodic or pronunciation issues may surface with complex text.

| Language | Code | Quality Rating | Notes |
|----------|------|---------------|-------|
| **Arabic** | `ar` | Good | Modern Standard Arabic. Dialectal Arabic (Egyptian, Gulf, Levantine) varies. Right-to-left text correctly parsed. Diacritical marks (tashkeel) improve pronunciation accuracy. |
| **Chinese (Mandarin)** | `zh` | Good | Simplified Chinese input. Tone handling is generally correct but may falter on rare characters or ambiguous pinyin. |
| **Japanese** | `ja` | Good | Kanji, hiragana, and katakana all supported. Pitch accent approximated. Keigo (formal) vs casual register detection is limited — specify in prompt context. |
| **Korean** | `ko` | Good | Hangul input. Honorific levels not automatically detected. Generally natural prosody. |
| **Russian** | `ru` | Good | Stress placement is generally accurate. Reduction of unstressed vowels handled. |
| **Danish** | `da` | Good | Stød (glottal stop) approximated. Some compound words may have incorrect stress. |
| **Norwegian** | `no` | Good | Bokmål is primary. Nynorsk may produce unexpected pronunciations. |
| **Finnish** | `fi` | Good | Long compound words handled reasonably. Vowel harmony correct. |
| **Greek** | `el` | Good | Modern Greek. Stress marks important for correct pronunciation. |
| **Hungarian** | `hu` | Good | Vowel length distinctions and agglutinative word forms generally handled. |
| **Bulgarian** | `bg` | Good | Cyrillic input. Stress placement generally correct. |
| **Croatian** | `hr` | Good | Latin script with diacriticals. Pitch accent approximated. |
| **Slovak** | `sk` | Good | Similar to Czech. Handled well. |
| **Tamil** | `ta` | Good | Tamil script input supported. Retroflex consonants approximated. |
| **Vietnamese** | `vi` | Good | Tonal language. Tone marks critical for correct output — always include diacriticals. |
| **Welsh** | `cy` | Good | Mutations and ll/ch sounds approximated. |

---

## Accent Handling

### Same Language, Different Accents

ElevenLabs voices carry inherent accents based on the speaker they were trained on. To produce a specific accent:

1. **Select a voice with the target accent.** A British-accented voice reading English text will maintain the British accent regardless of content. See `voice-catalog.yaml` for accent tags.
2. **Do not mix accent expectations.** Asking a voice with an American accent to "speak with a British accent" in the prompt will not work — the voice's accent is fixed.
3. **For cloned voices:** The accent of the cloned voice is preserved. If you need multiple accents, clone multiple source recordings.

### Cross-Language Accent Bleed

When using a voice trained on one language to speak another:

- A voice trained on English speaking French will have an English accent in French. This is sometimes desirable (for a character who is a non-native speaker) but usually not.
- For natural-sounding multilingual content, prefer voices that were trained on the target language or are specifically marked as multilingual.
- The `eleven_multilingual_v2` model handles cross-language synthesis better than v1, but accent bleed is still possible.

### Accent-Specific Recommendations

| Desired Accent | Strategy |
|----------------|----------|
| American English | Use any American-accented stock voice (Adam, Rachel, Josh, etc.) |
| British English | Use Daniel or Charlotte from the catalog |
| Australian English | Limited stock options. Consider cloning an Australian speaker. |
| Latin American Spanish | Select a Latin American voice, not a Castilian one |
| Brazilian Portuguese | Select a Brazilian voice, not European Portuguese |
| Mandarin (Standard) | Use a Mandarin-trained voice with `zh` language code |

---

## Multilingual Voice Support

### Single Voice, Multiple Languages

The `eleven_multilingual_v2` model can use a single voice to speak multiple languages. The voice's timbre and character are preserved, but the accent will shift based on the language.

**How to trigger multilingual output:**
- Simply write the text in the target language. The model auto-detects the language.
- For short phrases, explicit language hints may improve detection: prefix with `[Language: French]` in the text (experimental, not officially supported).
- Mixed-language text (e.g., English with French phrases) is handled but may produce uneven quality at language boundaries.

### Best Practices for Multilingual Projects

1. **Test each voice in your target language** before committing. Not all voices perform equally across languages.
2. **Use separate voice configs per language** in the character `identity.json` if needed — different stability/clarity settings may be optimal for different languages.
3. **Avoid code-switching within a single API call.** If a narration switches between languages, split it into separate calls at the language boundary and concatenate.
4. **Provide clean text.** Remove English annotations, stage directions, or metadata from non-English text before sending to the API.

---

## Pronunciation Tuning

### Using SSML-like Controls

ElevenLabs does not support full SSML, but it does respond to certain text formatting cues:

| Technique | Example | Effect |
|-----------|---------|--------|
| Commas for pauses | "And then, she turned." | Inserts a brief pause |
| Periods for longer pauses | "He waited. And waited." | Longer pause between sentences |
| Ellipsis for hesitation | "I think... maybe not." | Creates a trailing, hesitant pause |
| ALL CAPS for emphasis | "This is VERY important." | Slight emphasis (inconsistent, not guaranteed) |
| Hyphens for spelling | "The code is A-B-C-1-2-3." | Spells out letters/numbers individually |
| Quotation marks | She said "hello" softly. | May slightly alter delivery of quoted text |

### Pronunciation Corrections

For words the model mispronounces:

1. **Phonetic respelling:** Replace the problem word with a phonetic approximation. Example: "Nguyen" might be respelled as "Win" if consistently mispronounced.
2. **Contextual hints:** Add context before the word. "The city of Leicester (pronounced Lester)..." — the model sometimes picks up pronunciation hints in parentheses.
3. **IPA fallback:** ElevenLabs has experimental IPA support for some models. Wrap in IPA tags if available: `<phoneme alphabet="ipa" ph="lɛstər">Leicester</phoneme>`.

### Numbers and Dates

- **Numbers:** Written digits are usually read correctly. "2024" reads as "twenty twenty-four." For exact control, spell out: "two thousand twenty-four."
- **Currency:** "$50" reads as "fifty dollars." "€30" reads as "thirty euros."
- **Dates:** "March 3, 2026" reads naturally. ISO format "2026-03-03" may read digit-by-digit — spell out dates for narration.
- **Phone numbers:** Separate with hyphens for digit-by-digit reading: "5-5-5-0-1-2-3."
- **Abbreviations:** Some are auto-expanded (Mr., Dr., etc.). Others may read letter-by-letter. Spell out if unsure.

---

## Quality Validation by Language

Before using a non-English language in production:

1. Generate a 30-second sample with representative content.
2. Have a native speaker review for:
   - Pronunciation accuracy
   - Natural prosody and rhythm
   - Correct stress/tone placement
   - Appropriate formality register
3. Test with proper nouns, numbers, and any domain-specific terminology.
4. Document any systematic issues for the project's language guide.

---

## Known Limitations

- **Tonal languages (Chinese, Vietnamese, Thai):** Tone accuracy is good but not perfect. Critical for meaning — review carefully.
- **Agglutinative languages (Finnish, Hungarian, Turkish):** Very long compound words may have incorrect stress or unnatural pauses.
- **Right-to-left languages (Arabic, Hebrew):** Text processing is correct, but ensure your input pipeline does not reverse or corrupt the text.
- **Low-resource languages:** Languages not listed above may work with `eleven_multilingual_v2` but with unpredictable quality. Test extensively.
- **Singing/chanting:** No language supports sung output. The model is speech-only.
- **Whispering in non-English languages:** Whisper effects (via low stability) are less predictable outside English.
