class CandidateKnowledge {

  static get() {

    return {

      personal: {
        name: "Mayank Sharma",
        title: "Senior Data Engineer",
        experienceYears: 7,
        english: "Fluent",
        germanLevel: "A2",
        germanGoal: "B1 then C1"
      },

      technicalSkills: {
        cloud: [
          "Azure",
          "AWS"
        ],

        dataEngineering: [
          "Azure Data Factory",
          "Azure Databricks",
          "Azure Synapse",
          "ADLS",
          "Snowflake",
          "dbt",
          "Spark",
          "PySpark",
          "Delta Lake",
          "SQL",
          "Python"
        ],

        orchestration: [
          "Airflow",
          "AWS Step Functions"
        ],

        aws: [
          "Glue",
          "Athena",
          "Redshift",
          "Lambda",
          "S3"
        ]
      },

      strengths: [
        "Metadata-driven ETL pipelines",
        "Production data engineering",
        "Pipeline optimization",
        "Incremental dbt models",
        "Performance tuning",
        "Large-scale data processing"
      ],

      projects: [
        {
          title: "Azure Lakehouse",
          summary: "Built metadata-driven Azure Data Engineering pipelines using ADF, Databricks, Synapse and ADLS."
        },
        {
          title: "AWS ETL",
          summary: "Designed scalable ETL pipelines using Glue, Lambda, S3 and Redshift."
        },
        {
          title: "dbt Modernization",
          summary: "Migrated legacy SQL transformations to modular dbt incremental models."
        }
      ]

    };

  }

  static getAllSkills() {

    const data = this.get();

    return Object.values(data.technicalSkills).flat();

  }

  static hasSkill(skill) {

    return this
      .getAllSkills()
      .some(s => s.toLowerCase() === skill.toLowerCase());

  }

}