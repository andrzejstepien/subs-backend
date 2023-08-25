export const valueExistsInColumn = async (db, table, column, value) => {

    const number = await db(table)
      .count('* as count')
      .where(column, value)
    return number[0].count > 0
}

export const storyExists = async (db,story) => {
    return valueExistsInColumn(db,'stories','title',story)
}