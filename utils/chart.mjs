class Chart {
    constructor(title, data){
        this.title = title;
        this.data = data;
    }
    
    getChart(){
        const date_now = new Date();
        const year = date_now.getFullYear();
        const today = year+'-'+("0" + (date_now.getMonth() + 1)).slice(-2)+'-'+("0" + date_now.getDate()).slice(-2);
        const date_yesterday = new Date(date_now.setDate(date_now.getDate()-1));
        const yesterday = year+'-'+("0" + (date_yesterday.getMonth() + 1)).slice(-2)+'-'+("0" + date_yesterday.getDate()).slice(-2);

        return {
            type: 'bar',
            parsing: false,
            data: {
                labels: [String(today),String(yesterday)],
                datasets: [{
                    axis: 'x',
                    label: this.title,
                    data: this.data,
                    backgroundColor: [
                        'rgba(4, 10, 76, 0.2)',
                        'rgba(61, 85, 3, 0.2)'
                    ],
                    borderColor: [
                        'rgb(4, 10, 76)',
                        'rgb(61, 85, 3)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
            indexAxis: 'x',
            }
        }
    }
}

export default Chart;