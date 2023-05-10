import * as React from 'react'
import { DataGrid, GridColDef, GridCellEditCommitParams, GridValueGetterParams } from '@material-ui/data-grid'

interface Props {
  keyId: string
  rows: any[]
  columns: GridColDef[]
  gridEdit?: (params: GridCellEditCommitParams) => void
}

export default function DataTable(props: Props) {

  function onGridEdit (params:GridCellEditCommitParams) {
    if (props.gridEdit) {
      props.gridEdit(params)
    } else {
      return
    }
  }

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={props.rows}
        columns={props.columns}
        getRowId={(row: any) => row[props.keyId]}
        pageSize={5}
        onCellEditCommit={(params: GridCellEditCommitParams) => onGridEdit(params)}
      />
    </div>
  )
}
