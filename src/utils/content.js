// text of book and its translations

import original from '../../assets/content'
import translations from '../../assets/translations'
import { map, orderBy } from 'lodash'
import { prefixedIndex } from './utils'

export class Content {
    constructor(original, translations) {
        this.original = original
        this.translations = translations
    }

    // main content

    getInfo() {
        const { info } = this.original
        return info
    }

    /**
     * @returns ['ru', 'en', 'es']
     */
    getTranslations() {
        const { translations } = this.original
        return translations
    }

    /**
     * @returns titles of chapters
     */
    getChapterTitles() {
        const { content: chaptersRaw } = this.original
        let chapters = map(chaptersRaw, (elem, key) => {
            const { title = '???' } = elem
            return { id: key, title }
        })
        chapters = orderBy(chapters, 'id')
        return chapters
    }

    // object { chapterId: { title: "Chapter title" }, ... }
    getChapterTitlesTr(trLang) {
        if (!trLang) return {}
        try {
            let chapters = this.translations[trLang]['default']['content']
            chapters = map(chapters, (elem, key) => {
                const { title = '???' } = elem
                return { id: key, title }
            })
            return chapters.reduce(
                (prev, item) => ({...prev, [item.id]: { title: item.title } }), {}
            )
        } catch (e) {
            console.log('translation error, ', e)
            return {}
        }
    }

    getChapter(chapterId) {
        const chapterDoc = this.original.content[chapterId]
        return chapterDoc
    }

    // array [ { id, title }, ... ]
    getChapterTr(trLang, chapterId) {
        if (!(trLang && chapterId)) return {}
        try {
            const trDoc =
                this.translations[trLang]['default']['content'][chapterId] || {}
            return trDoc
        } catch (e) {
            console.log('translation error, ', e)
            return {}
        }
    }

    getSubchapter(chapterId, subchapterId) {
        const subchapterDoc = this.original.content[chapterId].content[subchapterId]
        return subchapterDoc
    }

    getSubchapterTr(trLang, chapterId, subchapterId) {
        if (!(trLang && chapterId && subchapterId)) return {}
        try {
            const subchapterDoc =
                this.translations[trLang].default.content[chapterId].content[
                    subchapterId
                ] || {}
            return subchapterDoc
        } catch (e) {
            console.log('translation error, ', e)
            return {}
        }
    }
    getPhrases(chapterId, subchapterId, arrayOfIndexes) {
        const { content: subchapterDoc } = this.original.content[chapterId].content[
            subchapterId
        ]
        const phrases = arrayOfIndexes.map(phraseIndex => {
            const phraseId = prefixedIndex(phraseIndex)
            const phrase = subchapterDoc[phraseId]
            return phrase
        })
        return phrases
    }
    getPhrasesTr(trLang, chapterId, subchapterId, arrayOfIndexes) {
        const { content: subchapterDoc } = this.translations[
            trLang
        ].default.content[chapterId].content[subchapterId]
        const phrases = arrayOfIndexes.map(phraseIndex => {
            const phraseId = prefixedIndex(phraseIndex)
            const phrase = subchapterDoc[phraseId]
            return phrase
        })
        return phrases
    }
}

const content = new Content(original, translations)

export default content