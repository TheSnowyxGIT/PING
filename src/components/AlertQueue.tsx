import React from "react";
import { Alert, AlertProps } from "./Alert";


type NewAlert = AlertProps & {time: number};
type DatedAlert = NewAlert & {createdAt: Date};

interface AlertQueueProps {
    
}
 
interface AlertQueueState {
    alerts: DatedAlert[]
}
 
class AlertQueue extends React.Component<AlertQueueProps, AlertQueueState> {

    public static sendAlert(alert: NewAlert){
        let alertQueue = new AlertQueue({});
        alertQueue.addAlert(alert);
    }

    private static instance: AlertQueue;
    constructor(props: AlertQueueProps) {
        if (AlertQueue.instance){
            return AlertQueue.instance;
        }
        super(props);
        this.state = {
            alerts: []
        };
        AlertQueue.instance = this;
    }

    public addAlert(alert: NewAlert){
        const datedAlert: DatedAlert = {
            content: alert.content,
            title: alert.title,
            type: alert.type,
            time: alert.time,
            createdAt: new Date()
        };
        this.state.alerts.push(datedAlert);
        this.setState({
            alerts: this.state.alerts
        });
        setTimeout(() => {
            let index = 0;
            for (let alert of this.state.alerts){
                if (alert.createdAt === datedAlert.createdAt){
                    break;
                }
                index += 1;
            }
            this.state.alerts.splice(index, 1);
            this.setState({
                alerts: this.state.alerts
            });
        }, datedAlert.time);
    }

    render() { 
        return (
        <div>
            <div className="Alerts">
                {this.state.alerts.map(alert => {
                    return (
                        <Alert type={alert.type} content={alert.content} title={alert.title}/>
                    )
                })}
            </div>
        </div>
        );
    }
}
 
export default AlertQueue;
