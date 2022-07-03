import { Crate, CratesIO, SearchResult, Summary } from "crates.io";
import { resolve } from "path";
import { F_CratesDependency } from "../../src/shared/F_interfaces";
import { Report } from "../../src/shared/report";

const cratesIO = new CratesIO()

//get summury
export async function getCratesDependenciesSummary(): Promise<Report<F_CratesDependency[]>> {
    return new Promise((resolve, _) => {
        cratesIO.summary()
                .then((data: Summary) => {
                    resolve(Report.getReport({
                        isSuccess: true,
                        data: data.most_downloaded.concat(data.just_updated).map((dep:Crate) => {return {
                            id: dep.id,
                            lastestVersion: dep.max_version,
                            currentPage: 1,
                            isLastPage: true
                        }})
                    }));
                })
    });
}

export async function getCratesDependencies(name: string, pageId: number): Promise<Report<F_CratesDependency[]>> {
    return new Promise((resolve, _) => {
        cratesIO.api.crates.getCrates(name, {page: pageId, per_page:20})
                            .then((data: SearchResult) => {
                                resolve(Report.getReport(
                                    {
                                        isSuccess: true,
                                        data: data.crates.map((dep:Crate) => {return {
                                            id: dep.id,
                                            lastestVersion: dep.max_version,
                                            currentPage: pageId,
                                            isLastPage: data.meta.total / 20 === pageId
                                        }})
                                    }
                                ))
                            })
    });
}