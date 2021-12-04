<p align="center">
  <img src="https://user-images.githubusercontent.com/8394411/143149921-d5c0be77-b961-4106-85f5-ce02115d73ab.png" />
</p>

<div align="center">
  <center><h1>Kyoka</h1></center>
</div>

Kyoka is a web app that utilizes flashcards distributed through a spaced repetition system in order to assist with the retention of information long-term. It also includes specific tools developed for language learning. 
Kyoka is heavily inspired by [Anki](https://apps.ankiweb.net/), but aims to offer a more streamlined experience. The video below showcases the project's main features.

[![Kyoka video](https://img.youtube.com/vi/Q3iN2oseNrk/0.jpg)](https://www.youtube.com/watch?v=Q3iN2oseNrk)

# Key features

- Managing flashcards grouped into decks, which can be divided by subject
- Generating cards automatically through the clipboard page
- Highlighting known words in the clipboard for easy spotting
- Uploading dictionaries for quick lookups
- Dynamic card layout
- Currently available in English, Portuguese, and Japanese

# Notes

- Automatic card creation is only available for cards about English in either Portuguese or Japanese
- Dictionaries must be JSON files, where the first element should include a language attribute with the locale code (pt, ja or en), and all the other elements should include "term" and "definition" attributes for each entry

# Acknowledgements

### APIs used for card generation
- [Pexels](https://www.pexels.com/) - Images
- [VoiceRSS](http://www.voicerss.org/) - Text-to-speech
- [Tatoeba](https://tatoeba.org/) - Example sentences and word audio
- [Free Dictionary API](https://dictionaryapi.dev/) - English definitions
- [Libre Translate](https://translate.argosopentech.com/) - Machine translation

# License

[MIT](https://choosealicense.com/licenses/mit/)
