module.exports = async function (model, page, limit) {
    const total = await model.countDocuments();
    const totalPage = Math.ceil(total / limit);
    const start = (page - 1) * limit + 1;
    let end = start + limit - 1;
    if (end > total) end = total;

    const pagination = { total, totalPage, start, end, limit };
    pagination.nowPage = page;

    if (page < totalPage) pagination.nextPage = page + 1;
    if (page > 1) pagination.prevPage = page - 1;
    return pagination;
};


