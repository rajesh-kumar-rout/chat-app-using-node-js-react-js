const getHours = (date) => {
    return date.getHours() > 12
        ? `${(date.getHours() - 12)}:${date.getMinutes()} PM`
        : `${date.getHours()}:${date.getMinutes()} AM`
}

export const chatTime = (date) => {
    date = new Date(date)
    return new Date(date).toDateString() === new Date().toDateString()
        ? getHours(date)
        : `${date.getDate()}/${date.getHours()}/${date.getYear()} ${getHours(date)}`
}