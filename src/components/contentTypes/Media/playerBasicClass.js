import { Alert } from 'react-native'
import mitt from 'mitt'

class Player {
	constructor(mediaRef) {
		if (mediaRef.current) {
			this.mediaObject = mediaRef.current
			this.updateDuration()
			this.events.emit('isReady', true)
			this.mediaObject.setOnPlaybackStatusUpdate(this.handleOnPlayAudioUpdate)
		} else {
			const messages = [`Audio doesn't exist`, `Please, contact the admin`]
			console.log(...messages)
			Alert(...messages)
		}
	}
	events = mitt()
	mediaObject = null
	currentTime = 0
	rate = 1

	handleOnPlayAudioUpdate = playbackStatus => {
		const { positionMillis, isPlaying } = playbackStatus
		const currentTime = positionMillis / 1000
		this.currentTime = currentTime
		this.events.emit('isPlaying', isPlaying)
		this.events.emit('currentTime', currentTime)
	}

	async updateDuration() {
		// there isn't event as audioIsReady, that we can get duration
		// therefore we'll be trying until we get it.
		const { durationMillis } = await this.getStatus()
		if (durationMillis) {
			const duration = durationMillis / 1000
			this.duration = duration
			this.events.emit('duration', duration)
		} else {
			setTimeout(() => {
				this.updateDuration()
			}, 1000)
		}
	}

	async play() {
		this.mediaObject.playAsync()
	}
	async pause() {
		this.mediaObject.pauseAsync()
	}

	playPlus10() {
		this.setStatus({ positionMillis: (this.currentTime + 10) * 1000 })
	}
	playMinus10() {
		this.setStatus({ positionMillis: (this.currentTime - 10) * 1000 })
	}
	seek(time) {
		this.setStatus({ positionMillis: time * 1000 })
		this.events.emit('currentTime', time)
	}
	changeRate() {
		this.rate = this.rate + 0.25
		if (this.rate > 2) this.rate = 0.25
		const rate = this.rate
		this.setStatus({
			rate,
			shouldCorrectPitch: true,
			pitchCorrectionQuality: 'High'
		})
		this.events.emit('rate', rate)
	}
	unload() {
		if (this.mediaObject) {
			this.mediaObject.unloadAsync()
			this.mediaObject = null
		}
	}

	async setStatus(settings) {
		this.mediaObject.setStatusAsync({ ...settings })
	}
	async getStatus() {
		return this.mediaObject.getStatusAsync()
	}
}

export default Player