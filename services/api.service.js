import https from 'https'
import { getKeyValue, TOKEN_DICTIONARY } from './storage.service.js'
import axios from 'axios'

const getIcon = (icon) => {
	switch (icon.slice(0, -1)) {
		case '01':
			return '☀️'
		case '02':
			return '🌤️'
		case '03':
			return '☁️'
		case '04':
			return '☁️'
		case '09':
			return '🌧️'
		case '10':
			return '🌦️'
		case '11':
			return '🌩️'
		case '13':
			return '❄️'
		case '50':
			return '🌫️'
	}
}

const getWeather = async (city) => {
	const token = await getKeyValue(TOKEN_DICTIONARY.token)
	if (!token) {
		throw new Error('Не задан ключ API, задайте его через команду -t [API_KEY]')
	}

	const response = await axios.get('https://api.openweathermap.org/geo/1.0/direct', {
		params: {
			q: city,
			appid: token
		}
	})

	const [coords] = response.data

	if (!coords) {
		throw new Error('Неверно задан город')
	}

	const lat = coords.lat
	const lon = coords.lon

	const { data } = await axios.get('https://api.openweathermap.org/data/2.5/weather', {
		params: { lat: lat, lon: lon, appid: token, lang: 'ru', units: 'metric' }
	})

	return data
}

export { getWeather, getIcon }
