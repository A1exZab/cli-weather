#!/usr/bin/env node
import { getArgs } from './helpers/args.js'
import { getIcon, getWeather } from './services/api.service.js'
import { printHelp, printError, printSuccess, printWeather } from './services/log.service.js'
import { getKeyValue, setKeyValue, TOKEN_DICTIONARY } from './services/storage.service.js'

const saveToken = async (token) => {
	if (!token.length) {
		printError('Не передан токен')
		return
	}
	try {
		await setKeyValue(TOKEN_DICTIONARY.token, token)
		printSuccess('Токен сохранен')
	} catch (e) {
		printError(e.message)
	}
}

const saveCity = async (city) => {
	if (!city.length) {
		printError('Не передан город')
		return
	}
	try {
		await setKeyValue(TOKEN_DICTIONARY.city, city)
		printSuccess('Город сохранен')
	} catch (e) {
		printError(e.message)
	}
}

const getForecast = async () => {
	try {
		const city = await getKeyValue(TOKEN_DICTIONARY.city)
		const weather = await getWeather(city)
		const icon = getIcon(weather.weather[0].icon)
		printWeather(weather, icon)
	} catch (e) {
		if (e?.response?.status == 401) {
			printError('Неверно указан токен')
		} else {
			printError(e.message)
		}
	}
}

const initCLI = () => {
	const args = getArgs(process.argv)
	// process.env.TEST = 1
	// console.log(process.env)
	if (args.h) {
		return printHelp()
	}
	if (args.s) {
		// cохранить город
		return saveCity(args.s)
	}
	if (args.t) {
		return saveToken(args.t)
	}
	return getForecast()
	// вывести погоду
}

initCLI()
