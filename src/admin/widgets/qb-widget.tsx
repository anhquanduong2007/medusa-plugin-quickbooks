import React from 'react'

const QuickBooksSync = () => {
   const [isQbAuth, setIsQbAuth] = React.useState<boolean>(false)
   const [loading, setLoading] = React.useState<boolean>(false)

   React.useEffect(() => {
      fetch('http://localhost:9000/isQbAuth')
         .then((d) => d.json())
         .then((r) => {
            setIsQbAuth(r.isAuth)
         })
   }, [])

   const connect = () => {
      window.location.href = 'http://localhost:9000/authUri'
   }

   const sync = async () => {
      setLoading(true)
      const res = await fetch('http://localhost:9000/sync')
      const d = await res.json()
      if (d.success) {
         setLoading(false)
      }
   }

   return (
      <div className="flex justify-end mb-2">
         <button onClick={connect} className={`${isQbAuth ? 'pointer-events-none opacity-50' : null} text-gray-900 bg-white hover:bg-gray-100 border border-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 font-bold rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-gray-800 dark:bg-white dark:border-gray-700 dark:text-gray-900 dark:hover:bg-gray-200 mr-2`}>
            {isQbAuth ? 'Connected' : 'Connect'}
         </button>
         <button onClick={sync} disabled={loading} className="text-gray-900 bg-white hover:bg-gray-100 border border-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 font-bold rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-gray-800 dark:bg-white dark:border-gray-700 dark:text-gray-900 dark:hover:bg-gray-200">
            {
               loading ? (
                  <React.Fragment>
                     <svg aria-hidden="true" role="status" className="inline w-4 h-4 mr-3 text-gray-200 animate-spin dark:text-gray-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="#1C64F2" />
                     </svg>
                     Loading...
                  </React.Fragment>
               ) : (
                  <React.Fragment>
                     <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 60 60" fill="none" aria-hidden="true" className="mr-2 -ml-1">
                        <path
                           d="M30 0C13.4101 0 0 13.4091 0 30C0 46.5455 13.4101 60 30 60C46.5438 60 60 46.5909 60 30C59.9539 13.4091 46.5438 0 30 0ZM28.341 49.6364C25.9447 49.6364 24.0092 47.6818 24.0092 45.3182V22.6364H20C15.9447 22.6364 12.6728 25.9091 12.6728 29.9545C12.6728 34 15.9447 37.2727 20 37.2727H21.659V41.5909H20C13.5484 41.6364 8.34101 36.4091 8.34101 30C8.34101 23.5455 13.5484 18.3182 20 18.3182H28.341V49.6364ZM40 41.6364H31.659V10.3182C34.0553 10.3182 35.9908 12.2727 35.9908 14.6364V37.2727H40C44.0553 37.2727 47.3272 34 47.3272 29.9545C47.3272 25.9091 44.0553 22.6364 40 22.6364H38.341V18.3182H40C46.4516 18.3182 51.659 23.5455 51.659 30C51.659 36.4091 46.4055 41.6364 40 41.6364Z"
                           fill="#2CA01C"
                        />
                     </svg>
                     intuit quickbooks
                  </React.Fragment>
               )
            }
         </button>
      </div>
   )
}

export const config = {
   zone: "product.list.before",
}

export default QuickBooksSync