//M.Rajkaran
//2109039
//DIT/FT/1B/02
var db = require('./databaseConfig.js')
//, returnDate
var rabbitDB = {
    getFlight: async function (departureDate, returnDate, destination, callback) {
        try {
            const database = await db.getConnection();
            const collection = database.collection('flights');

            const query = [
                {
                    $match: {
                        $or: [
                            {
                                srccity: "Singapore",
                                destcity: destination,
                                date: new Date(departureDate)
                            },
                            {
                                srccity: destination,
                                destcity: "Singapore",
                                date: new Date(returnDate)
                            }
                        ]
                    }
                },
                {
                    $group: {
                        _id: {
                            $cond: {
                                if: { $eq: ["$srccity", "Singapore"] },
                                then: "$destcity",
                                else: "$srccity"
                            }
                        },
                        departure: {
                            $min: {
                                $cond: [
                                    { $eq: ["$srccity", "Singapore"] },
                                    { price: "$price", airlinename: "$airlinename" },
                                    null
                                ]
                            }
                        },
                        return: {
                            $min: {
                                $cond: [
                                    { $eq: ["$srccity", "Singapore"] },
                                    null,
                                    { price: "$price", airlinename: "$airlinename" }
                                ]
                            }
                        }
                    }
                },
                {
                    $project: {
                        _id: 0,
                        City: "$_id",
                        "Departure Date": { $dateToString: { format: "%Y-%m-%d", date: new Date(departureDate) } },
                        "Departure Airline": { $ifNull: ["$departure.airlinename", ""] },
                        "Departure Price": { $ifNull: ["$departure.price", Infinity] },
                        "Return Date": { $dateToString: { format: "%Y-%m-%d", date: new Date(returnDate) } },
                        "Return Airline": { $ifNull: ["$return.airlinename", ""] },
                        "Return Price": { $ifNull: ["$return.price", Infinity] }
                    }
                },
                {
                    $sort: {
                        "Departure Price": 1,
                        "Return Price": 1
                    }
                }
            ];


            const result = await collection.aggregate(query).toArray();
            console.log(result);
            return callback(null, result);
        } catch (error) {
            console.error('Error fetching flights:', error);
            return callback(error, null);
        }
    },

    getHotel: async function (checkInDate, checkOutDate, destination, callback) {
        try {
            const database = await db.getConnection();
            const collection = database.collection('hotels');

            const query = [
                {
                  $match: {
                    city: destination,
                    date: {
                      $gte: new Date(checkInDate),
                      $lte: new Date(checkOutDate)
                    }
                  }
                },
                {
                  $group: {
                    _id: "$hotelName",
                    totalPrice: {
                      $sum: "$price"
                    }
                  }
                },
                {
                  $sort: {
                    totalPrice: 1
                  }
                },
                {
                  $limit: 1
                },
                {
                  $project: {
                    _id: 0,
                    City: destination,
                    "Check In Date": { $dateToString: { format: "%Y-%m-%d", date: new Date(checkInDate) } },
                    "Check Out Date": { $dateToString: { format: "%Y-%m-%d", date: new Date(checkOutDate) } },
                    Hotel: "$_id",
                    Price: "$totalPrice"
                  }
                }
              ];              

            const result = await collection.aggregate(query).toArray();
            console.log(result);
            return callback(null, result);
        } catch (error) {
            console.error('Error fetching hotels:', error);
            return callback(error, null);
        }
    }


}

module.exports = rabbitDB

