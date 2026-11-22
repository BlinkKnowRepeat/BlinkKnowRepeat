"""Prepare the public-copy dictionaries with local IndicTrans2 inference.

Requires the optional build-only package bhashantar==0.1.1. The website
loads the finished dictionaries and does not run a translation model.
"""
import argparse
import json
import re
from pathlib import Path

from bhashantar import Translator
from bhashantar.engine import resolve_model_dir

TARGETS = dict(
    hi='hin_Deva', gu='guj_Gujr', mr='mar_Deva', ur='urd_Arab',
    as_='asm_Beng', bn='ben_Beng', brx='brx_Deva', doi='doi_Deva',
    kn='kan_Knda', ks='kas_Arab', kok='gom_Deva', mai='mai_Deva',
    ml='mal_Mlym', mni='mni_Mtei', ne='npi_Deva', or_='ory_Orya',
    pa='pan_Guru', sa='san_Deva', sat='sat_Olck', sd='snd_Arab',
    ta='tam_Taml', te='tel_Telu',
)
TARGETS = {key.rstrip('_'): code for key, code in TARGETS.items()}


def chunks(text):
    if len(text) <= 700:
        return [text]
    return re.findall(r'.{1,650}(?:[.!?](?=\s)|(?=\s|$))', text)


def engine(args):
    translator = Translator(threads=args.threads, beam_size=args.beam, max_batch_size=64)
    if args.cuda:
        import ctranslate2
        import sentencepiece

        path = resolve_model_dir()
        translator.model_dir = path
        translator._source_pieces = sentencepiece.SentencePieceProcessor(model_file=str(path / 'model.SRC'))
        translator._model = ctranslate2.Translator(str(path), device='cuda', compute_type='int8_float16')
    return translator


def generate(translator, inputs, language):
    parts = [chunks(text) for text in inputs]
    flat = [part for text in parts for part in text]
    translated = []
    for index in range(0, len(flat), 64):
        batch = flat[index:index + 64]
        translated.extend(translator.translate(batch, tgt=language))
    iterator = iter(translated)
    return [' '.join(next(iterator).strip() for _ in parts_for_text) for parts_for_text in parts]


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('corpus', type=Path)
    parser.add_argument('locales', nargs='*', choices=tuple(TARGETS))
    parser.add_argument('--cuda', action='store_true')
    parser.add_argument('--threads', type=int, default=6)
    parser.add_argument('--beam', type=int, default=2)
    args = parser.parse_args()
    source = json.loads(args.corpus.read_text())
    translator = engine(args)
    root = Path('src/translations')
    root.mkdir(exist_ok=True)
    for locale in args.locales or TARGETS:
        file = root / (locale + '.json')
        dictionary = json.loads(file.read_text()) if file.exists() else {}
        missing = [text for text in source if text not in dictionary]
        if missing:
            result = generate(translator, missing, TARGETS[locale])
            dictionary.update((text, value) for text, value in zip(missing, result) if value)
            temp = file.with_suffix('.tmp')
            temp.write_text(json.dumps(dictionary, ensure_ascii=False, indent=2, sort_keys=True) + '\n')
            temp.replace(file)
        print(f'{locale}: {len(dictionary)} translations, {len(missing)} attempted in this run', flush=True)


if __name__ == '__main__':
    main()
