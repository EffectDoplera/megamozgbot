import TelegramApi from 'node-telegram-bot-api'
import got from 'got'

const bot = new TelegramApi(process.env.BOT_TOKEN, {polling: true})

await bot.setMyCommands([
  {
    command: '/start',
    description: 'Начальное приветствие'
  },
  {
    command: '/info',
    description: 'Информация об предстоящих играх'
  }
])

bot.on('message', async ({text, chat}) => {
  const chatId  = chat.id

  if (text === '/info') {
    try {
      const [nextGameInfo] = await got.get(`${process.env.API_URL}events/dates/8?sort=played_at`).json();
      const {address, place, time, played_at} = nextGameInfo
      await bot.sendMessage(chatId, `${place}\n${address}\n${new Date(played_at).toLocaleDateString('ru', {month: 'long', day: 'numeric'})} ${time}`)
    } catch {
      await bot.sendMessage(chatId, 'Похоже кто-то пролил кофе на сервер. Повторите запрос позже')
    }
  }
})
