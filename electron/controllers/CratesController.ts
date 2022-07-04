import { Crate, CratesIO, SearchResult, Summary } from "crates.io";
import { resolve } from "path";
import { F_CratesDependencies} from "../../src/shared/F_interfaces";
import { Report } from "../../src/shared/report";

const cratesIO = new CratesIO()

//get summury
export async function getCratesDependenciesSummary(): Promise<Report<F_CratesDependencies>> {
    return new Promise((resolve, _) => {
        cratesIO.summary()
                .then((data: Summary) => {
                    resolve(Report.getReport({
                        isSuccess: true,
                        data: 
                        {
                            cratesList: data.most_downloaded.concat(data.just_updated).map((dep:Crate) => {return {
                                id: dep.id,
                                lastestVersion: dep.max_version,
                            }}),
                            lastPage: 0
                        }
                    }
                    ));
                })
    });
}

export async function getCratesDependencies(name: string, pageId: number): Promise<Report<F_CratesDependencies>> {
    return new Promise((resolve, _) => {
        cratesIO.api.crates.getCrates(name, {page: pageId, per_page:20})
                            .then((data: SearchResult) => {
                                resolve(Report.getReport(
                                    {
                                        isSuccess: true,
                                        data: 
                                        {
                                            cratesList: data.crates.map((dep:Crate) => {return {
                                                id: dep.id,
                                                lastestVersion: dep.max_version,
                                            }}),
                                            lastPage: Math.floor(data.meta.total / 20)
                                        }

                                    }
                                ))
                            })
    });
}