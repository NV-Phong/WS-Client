export async function fetchData() {
   try {
      const res = await fetch(`${process.env.API_SERVER}`, {
         cache: "no-store",
      });

      const response = await res.json();

      return { error: false, message: response.message, data: response.data };
   } catch (error) {
      console.log(error);
      return {
         error: true,
         message: "An error occurred while loading data",
         data: null,
      };
   }
}
